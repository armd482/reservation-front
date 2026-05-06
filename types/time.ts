interface AddTimeRequest {
  startAt: string;
}

interface TimeData extends AddTimeRequest {
  id: number,
}

interface AvailableTimeData extends TimeData {
  isAvailable: boolean;
}