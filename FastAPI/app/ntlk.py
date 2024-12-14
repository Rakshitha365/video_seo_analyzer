# import nltk
# import ssl

# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context

# nltk.download()
# nltk.download('punkt')

# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('omw-1.4')

import nltk
nltk.download('punkt')

def tokenize(token):
    return nltk.word_tokenize(token)
tokenize("why is this not working?")