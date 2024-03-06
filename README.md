# Transcriptor

https://github.com/aphananthe42/transcriptor/assets/68156481/d6fe689d-ee05-4809-8460-de8522bdd66e

## Overview

This is a CLI tool for transcribing and summarizing audio data.  
It can also distinguish speakers and output the transcription separately for each speaker, useful for meeting minutes.

## System

![Screenshot 2024-03-07 at 0 54 05](https://github.com/aphananthe42/transcriptor/assets/68156481/83d14a01-85ec-4218-a0a4-2ae0957bf755)

1. Transcriptor put audio data to S3.
2. AmazonTranscribe read audio data from S3.
3. AmazonTranscribe output transcription result to S3.(same bucket as the one where the audio data is stored.)
4. Transcriptor get transcription result from S3.
5. Transcriptor summarize transcription result via OpenAI API.
