import { TranscriptionResult } from "../Entity/TranscriptionResult.ts";

export class FormatService {
  static format(transcriptionResult: TranscriptionResult): string {
    let output = "spk_0: ";
    let currentSpeaker = "spk_0";

    for (const item of transcriptionResult.results.items) {
      const maxConfidenceAlternative = item.alternatives.reduce(
        (previous, current) => {
          const previousConfidence = parseFloat(previous.confidence);
          const currentConfidence = parseFloat(current.confidence);
          if (currentConfidence > previousConfidence) {
            return current;
          } else {
            return previous;
          }
        },
        item.alternatives[0],
      );
      if (item.speaker_label === currentSpeaker) {
        output += maxConfidenceAlternative.content;
      } else {
        currentSpeaker = item.speaker_label;
        output += `\n${currentSpeaker}: ${maxConfidenceAlternative.content}`;
      }
    }

    return output;
  }
}
