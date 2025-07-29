import { useContext, useEffect } from "react";
import { CountDownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";

function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setAmountSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentTotalSeconds = activeCycle
    ? totalSeconds - amountSecondsPassed
    : 0;
  const minutesNum = Math.floor(currentTotalSeconds / 60); // arredonda pra baixo (pega os minutos cheios)
  const secondsNum = currentTotalSeconds % 60; // pega o resto (segundos)
  const minutes = String(minutesNum).padStart(2, "0"); // obriga a string a ter 2 caracteres, e se não tiver, adiciona 0 no 'start'
  const seconds = String(secondsNum).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate)
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setAmountSecondsPassed(totalSeconds); // volta o contador pra 0 pois já se passaram todos os segundos
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval); // quando chamar o useEffect de novo, limpa o intervalo e começa um novo
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span> {/* primeira letra */}
      <span>{minutes[1]}</span> {/* segunda letra */}
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  );
}

export default Countdown;
