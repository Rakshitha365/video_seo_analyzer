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
API_KEY = 'AIzaSyAY0W4A3zkHV60rn5XMY4AKI5x8D17G9V8'

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
    """
    Integrates BART summarization with keyword generation.
    1. Summarizes the text using BART.
    2. Extracts keywords from the summary.
    """
    # Summarize the text
    summarized_text = summarize_text_with_bart(text)
    print("Summarized Text:", summarized_text)
    
    # Tokenize and extract keywords
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
    
    # Get video IDs of search results
    video_ids = [item['id']['videoId'] for item in search_response['items']]
    return video_ids

def get_video_details(video_ids):
    video_details = youtube.videos().list(
        part='snippet,statistics',
        id=','.join(video_ids)
    ).execute()
    
    return video_details

# Modified `seo_rank_for_keywords_using_youtube` to include relevant SEO rank data in normalized scores
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

            # Calculate relevance based on keyword occurrence in title or description
            title_score = 1 if keyword.lower() in title.lower() else 0
            description_score = 1 if keyword.lower() in description.lower() else 0

            # Engagement score multiplier based on views, likes, and comments
            engagement_score = views + likes + comments

            # Relevance score for this video
            relevance_score = (title_score + description_score) * engagement_score
            total_relevance_score += relevance_score

        keyword_relevance_scores.append({
            'keyword': keyword,
            'raw_score': total_relevance_score
        })

    # Normalize the scores and sort keywords
    max_score = max(item['raw_score'] for item in keyword_relevance_scores) if keyword_relevance_scores else 0

    for item in keyword_relevance_scores:
        item['normalized_score'] = (item['raw_score'] / max_score) * 100 if max_score > 0 else 0

    # Sort keywords by normalized score in descending order
    sorted_keywords = sorted(keyword_relevance_scores, key=lambda x: x['normalized_score'], reverse=True)

    return sorted_keywords

# Ensure the combined function returns SEO rank along with keywords
def generate_keywords_with_bart_and_seeds_using_youtube(text, seed_keywords):
    bart_keywords = generate_keywords_with_bart(text)
    combined_keywords = list(set(bart_keywords + seed_keywords))

    keyword_ranking = seo_rank_for_keywords_using_youtube(text, combined_keywords)

    return combined_keywords, keyword_ranking


# Example Usage
if __name__ == "__main__":
    # Extract text from video
    video_to_wav("input_video.mp4", "output_audio.wav")
    transcribed_text = wav_to_text("output_audio.wav")

    # Seed keywords provided by the user
    seed_keywords = ["artificial intelligence", "deep learning", "NLP"]

    # Generate keywords with BART integration and seed keywords
    combined_keywords, keyword_ranking = generate_keywords_with_bart_and_seeds_using_youtube(transcribed_text, seed_keywords)
    print("Final Keywords (BART + Seed):", combined_keywords)
    print("SEO Ranking of All Keywords:", keyword_ranking)
