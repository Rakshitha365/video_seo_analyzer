import requests
from SPARQLWrapper import SPARQLWrapper, JSON
from transformers import BartForConditionalGeneration, BartTokenizer
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from googleapiclient.discovery import build
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from keybert import KeyBERT
import string

# NLTK and model initialization
nltk.download('punkt')
nltk.download('stopwords')

r = sr.Recognizer()
kw_model = KeyBERT()
stop_words = set(stopwords.words('english'))
punctuation = set(string.punctuation)

# Load BART model and tokenizer
bart_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
bart_tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

# YouTube API Key
API_KEY = 'AIzaSyDFRwlp2U093yZxNPTecj9iQxKgCczvX8M'

# Initialize YouTube API client
youtube = build('youtube', 'v3', developerKey=API_KEY)

# Functions

def video_to_wav(input_video_path, output_audio_path):
    try:
        video = VideoFileClip(input_video_path)
        audio = video.audio
        audio.write_audiofile(output_audio_path, codec='pcm_s16le')
        print(f"Audio successfully extracted and saved to {output_audio_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

def wav_to_text(file_path):
    with sr.WavFile(file_path) as source:
        audio_text = r.record(source)
    try:
        return r.recognize_google(audio_text)
    except sr.RequestError as e:
        print(f"API request failed: {e}")
        return "API request failed"
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand the audio")
        return "Speech not recognized"

def summarize_text_with_bart(text, max_length=130, min_length=30):
    inputs = bart_tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = bart_model.generate(inputs, max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=True)
    return bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def generate_keywords_with_bart(text):
    summarized_text = summarize_text_with_bart(text)
    print("Summarized Text:", summarized_text)
    words = word_tokenize(summarized_text.lower())
    keywords = [word for word in words if word.isalpha() and word not in stop_words]
    keyword_freq = Counter(keywords)
    most_common_keywords = keyword_freq.most_common(12)
    return [keyword for keyword, _ in most_common_keywords]

def search_videos_by_keyword(keyword, max_results=5):
    search_response = youtube.search().list(
        q=keyword,
        part='id,snippet',
        type='video',
        maxResults=max_results
    ).execute()
    video_ids = [item['id']['videoId'] for item in search_response['items']]
    return video_ids

def get_video_details(video_ids):
    video_details = youtube.videos().list(
        part='snippet,statistics',
        id=','.join(video_ids)
    ).execute()
    return video_details

def seo_rank_for_keywords_using_youtube(text, keywords):
    keyword_relevance_scores = []
    for keyword in keywords:
        video_ids = search_videos_by_keyword(keyword)
        video_details = get_video_details(video_ids)
        total_relevance_score = 0
        for item in video_details['items']:
            title = item['snippet']['title']
            description = item['snippet']['description']
            views = int(item['statistics'].get('viewCount', 0))
            likes = int(item['statistics'].get('likeCount', 0))
            comments = int(item['statistics'].get('commentCount', 0))
            title_score = 1 if keyword.lower() in title.lower() else 0
            description_score = 1 if keyword.lower() in description.lower() else 0
            engagement_score = views + likes + comments
            relevance_score = (title_score + description_score) * engagement_score
            total_relevance_score += relevance_score
        keyword_relevance_scores.append({
            'keyword': keyword,
            'raw_score': total_relevance_score
        })
    max_score = max(item['raw_score'] for item in keyword_relevance_scores) if keyword_relevance_scores else 0
    for item in keyword_relevance_scores:
        item['normalized_score'] = (item['raw_score'] / max_score) * 100 if max_score > 0 else 0
    return sorted(keyword_relevance_scores, key=lambda x: x['normalized_score'], reverse=True)

def generate_keywords_with_bart_and_seeds_using_youtube(text, seed_keywords):
    bart_keywords = generate_keywords_with_bart(text)
    combined_keywords = list(set(bart_keywords + seed_keywords))
    keyword_ranking = seo_rank_for_keywords_using_youtube(text, combined_keywords)
    return combined_keywords, keyword_ranking

# Wikidata Integration Functions
def search_wikidata(keyword):
    url = 'https://www.wikidata.org/w/api.php'
    params = {
        'action': 'wbsearchentities',
        'format': 'json',
        'language': 'en',
        'search': keyword
    }
    response = requests.get(url, params=params).json()
    if response['search']:
        return response['search'][0]['id']
    else:
        print(f"No Wikidata entity found for {keyword}")
        return None

def query_wikidata_properties(entity_id):
    associated_keywords = []
    endpoint_url = "https://query.wikidata.org/sparql"
    query = f"""
    SELECT ?property ?propertyLabel ?value ?valueLabel WHERE {{
      VALUES ?prop {{wdt:P31 wdt:P279 wdt:P2283}}
      wd:{entity_id} ?prop ?value .
      ?property wikibase:directClaim ?prop .
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}
    }}
    """
    sparql = SPARQLWrapper(endpoint_url)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    sparql.addCustomHttpHeader("User-Agent", "MyWikidataBot/1.0 (22bd1a1226gdsc@gmail.com)")
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        property_label = result["propertyLabel"]["value"]
        value_label = result["valueLabel"]["value"]
        print(f"{property_label}: {value_label}")
        if property_label == 'subclass of':
            associated_keywords.append(value_label)
    return associated_keywords

def fetch_wikidata_details_for_keywords(keywords):
    wikidata_keywords = {}
    for keyword in keywords:
        entity_id = search_wikidata(keyword)
        if entity_id:
            associated_keywords = query_wikidata_properties(entity_id)
            wikidata_keywords[keyword] = associated_keywords
        else:
            wikidata_keywords[keyword] = []
    return wikidata_keywords

# Final Integration
if __name__ == "__main__":
    video_to_wav("input_video.mp4", "output_audio.wav")
    transcribed_text = wav_to_text("output_audio.wav")
    seed_keywords = ["artificial intelligence", "deep learning", "NLP"]
    combined_keywords, keyword_ranking = generate_keywords_with_bart_and_seeds_using_youtube(transcribed_text, seed_keywords)
    print("Final Keywords (BART + Seed):", combined_keywords)
    print("SEO Ranking of All Keywords:", keyword_ranking)
    wikidata_keywords = fetch_wikidata_details_for_keywords([item['keyword'] for item in keyword_ranking])
    print("Wikidata Keywords:", wikidata_keywords)