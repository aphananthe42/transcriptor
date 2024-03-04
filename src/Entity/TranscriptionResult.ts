export interface TranscriptionResult {
  jobName: string;
  accountId: string;
  status: string;
  results: {
    transcripts: [
      { transcript: string },
    ];
    speaker_labels: {
      segments: [
        {
          start_time: string;
          end_time: string;
          speaker_label: string;
          items: [{
            speaker_label: string;
            start_time: string;
            end_time: string;
          }];
        },
      ];
      channel_label: string;
      speakers: number;
    };
    items: [
      {
        type: string;
        alternatives: [
          {
            confidence: string;
            content: string;
          },
        ];
        start_time: string;
        end_time: string;
        speaker_label: string;
      },
    ];
  };
}
