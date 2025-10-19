function isMeetingWithinWorkday(workStart, workEnd, meetingStart, duration) {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const workStartMin = toMinutes(workStart),
    workEndMin = toMinutes(workEnd),
    meetingStartMin = toMinutes(meetingStart),
    meetingEndMin = meetingStartMin + duration;

  return meetingStartMin >= workStartMin && meetingEndMin <= workEndMin;
}

isMeetingWithinWorkday('08:00', '17:30', '14:00', 90);
