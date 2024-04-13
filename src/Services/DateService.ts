export class DateService {
  static createCurrentDateString(): string {
    const today = new Date();
    return `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}-${today.getHours()}-${today.getMinutes()}`;
  }
}
