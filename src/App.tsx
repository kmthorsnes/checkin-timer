import * as React from 'react';

interface Props {
  // Props for komponenten
}

interface State {
  checkInTime: Date | null;
  difference7h35m: number | null;
  difference8h: number | null;
  differenceFromNow: {
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
}

const CheckInComponent: React.FC<Props> = (props) => {
  const [checkInTime, setCheckInTime] = React.useState<Date | null>(null);
  const [difference7h35m, setDifference7h35m] = React.useState<number | null>(null);
  const [difference8h, setDifference8h] = React.useState<number | null>(null);
  const [differenceFromNow, setDifferenceFromNow] = React.useState<State['differenceFromNow']>(null);

  const handleCheckIn = () => {
    const currentTime = new Date();
    setCheckInTime(currentTime);
    localStorage.setItem('checkInTime', currentTime.toISOString());

    // Beregn differanse i timer, minutter og sekunder mellom nåværende tidspunkt og 7 timer og 35 minutter fra nå
    const difference7h35m = currentTime.getTime() - 7 * 60 * 60 * 1000 - 35 * 60 * 1000;
    setDifference7h35m(difference7h35m);

    // Beregn differanse i timer, minutter og sekunder mellom nåværende tidspunkt og 8 timer fra nå

    const difference8h = currentTime.getTime() - 8 * 60 * 60 * 1000;
    setDifference8h(difference8h);
  };

  React.useEffect(() => {
    const storedCheckInTime = localStorage.getItem('checkInTime');
    if (storedCheckInTime) {
      setCheckInTime(new Date(storedCheckInTime));
    }

    if (checkInTime) {
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const difference = currentTime.getTime() - checkInTime.getTime();
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        setDifferenceFromNow({
          hours,
          minutes: minutes % 60,
          seconds: seconds % 60,
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [checkInTime]);

  return (
    <div>
      <label htmlFor="check-in-time">Når sjekket du inn:</label>
      <input type="time" id="check-in-time" />
      <button onClick={handleCheckIn}>Sjekk inn nå</button>
      {checkInTime && (
        <div>
          <p>Du sjekket inn kl. {checkInTime.toLocaleTimeString()}</p>
          {difference7h35m && <p>Differanse til 7 timer og 35 minutter: {difference7h35m} ms</p>}
          {difference8h && <p>Differanse til 8 timer: {difference8h} ms</p>}
          {differenceFromNow && (
            <p>
              Tidsforskjell fra nå: {differenceFromNow.hours} timer, {differenceFromNow.minutes} minutter,{' '}
              {differenceFromNow.seconds} sekunder
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInComponent;
