from google.cloud import speech_v1p1beta1
import io
from flask import Flask,request
app = Flask(__name__)
import os
from google.cloud.speech_v1p1beta1.gapic import enums
from werkzeug import secure_filename
UPLOAD_FOLDER = '/home/####'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
from iso639 import languages


@app.route('/recog',methods=['POST'])
def recognize():
    print('hit received')
    client = speech_v1p1beta1.SpeechClient()
    # local_file_path = 'resources/brooklyn_bridge.flac'

    # The language of the supplied audio. Even though additional languages are
    # provided by alternative_language_codes, a primary language is still required.
    language_code = "fr"

    # Specify up to 3 additional languages as possible alternative languages
    # of the supplied audio.
    alternative_language_codes_element = "hi"
    alternative_language_codes_element_2 = "en"
    alternative_language_codes_element_3 = "es"
    alternative_language_codes = [
        "hi",
        "en",
        "es",
        'de'
    ]

    config = {
        "language_code": language_code,
        "alternative_language_codes": alternative_language_codes,
        "encoding":enums.RecognitionConfig.AudioEncoding.LINEAR16,
        "sample_rate_hertz": 48000,
    }
    if request.method == 'POST':
        print('files', request.files)
        f = request.files['audio']
        f.save(
            os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))

        if f:
            local_file_path=UPLOAD_FOLDER+'/'+f.filename
            with io.open(local_file_path, "rb") as f:
                content = f.read()
            audio = {"content": content}
            response = client.recognize(config, audio)
            res={}
            conf=0
            for result in response.results:
                # The language_code which was detected as the most likely being spoken in the audio
                print(u"Detected language: {}".format(result.language_code))
                # First alternative is the most probable result
                alternative = result.alternatives[0]
                print(u"Transcript: {}".format(alternative.transcript))
                temp = alternative.confidence
                if (conf < temp):
                    conf = temp
                    res['transcript'] = alternative.transcript
                    lang = languages.get(alpha2=result.language_code.split('-')[0])
                    res['language_code'] = lang.name
            print('res',res)
            return res

if __name__ == '__main__':
    app.run(host= '0.0.0.0')