export class DateUtils {
  static convertDate(date: Date): Date {
    const timezoneOffset = Number(process.env.TIMEZONE_OFFSET);
    const d = new Date(date.getTime());
    d.setTime(d.getTime() + timezoneOffset * 60 * 60 * 1000);
    return d;
  }

  static addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
