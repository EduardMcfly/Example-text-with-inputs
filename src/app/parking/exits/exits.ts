export interface Exit {
  id?: number;
  entry_id?: number;
  rate_id: number;
  date_departure: string;
  hour_departure: string;
  ammount_to_paid?: number;
  total_time?: string;
}
