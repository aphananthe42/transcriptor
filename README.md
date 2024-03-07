# Transcriptor

https://github.com/aphananthe42/transcriptor/assets/68156481/d6fe689d-ee05-4809-8460-de8522bdd66e

## Overview

This is a CLI tool for transcribing and summarizing audio data.  
It can also distinguish speakers and output the transcription separately for each speaker, useful for meeting minutes.

## Requirement

- Deno: >= 1.41.0
- Amazon S3 Bucket
- AWS IAM Access key pair
- OpenAI API key

## Technologies

- Deno
- TypeScript
- Amazon S3
- Amazon Transcribe

<img src="https://github.com/aphananthe42/transcriptor/assets/68156481/212ffafc-3a27-4641-ac92-d28855c1afc6" width="96px" height="96px">
<img src="https://github.com/aphananthe42/transcriptor/assets/68156481/a91bd08d-c87a-47f9-b236-2756c1d388d8" width="96px" height="96px">
<img src="https://github.com/aphananthe42/transcriptor/assets/68156481/a36dc6fa-dbcb-4065-932c-0f4aed9d21af" width="96px" height="96px">
<img src="https://github.com/aphananthe42/transcriptor/assets/68156481/0e8d1f4b-d7c5-47ec-9015-cb9ec65f028e" width="96px" height="96px">

## System

![Screenshot 2024-03-07 at 0 54 05](https://github.com/aphananthe42/transcriptor/assets/68156481/83d14a01-85ec-4218-a0a4-2ae0957bf755)

1. Transcriptor put audio data to S3.
2. AmazonTranscribe read audio data from S3.
3. AmazonTranscribe output transcription result to S3.(same bucket as the one where the audio data is stored.)
4. Transcriptor get transcription result from S3.
5. Transcriptor summarize transcription result via OpenAI API.

## Usage

### 1. Create .env file and fill in environment variables as per the following example.

```
$ git clone 
$ cd path/to/transcriptor
$ touch .env
```

```
AWS_ACCESS_KEY_ID="YOUR_AWS_IAM_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_IAM_SECRET_ACCESS_KEY"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET_NAME='your-s3-bucket-name'

OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
OPENAI_GPT_MODEL="your-prefer-gpt-model(ex. gpt-3.5-turbo)"
OPENAI_SYSTEM_PROMPT="system prompt for summarizing with GPT"
```

### 2. 

