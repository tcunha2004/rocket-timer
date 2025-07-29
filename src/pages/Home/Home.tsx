import { TbHandStop } from "react-icons/tb";
import Countdown from "./components/CountDown/CountDown";
import CycleForm from "./components/CycleForm/CycleForm";
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { BiPlay } from "react-icons/bi";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

interface FormData {
  task: string;
  minutesAmount: number;
}

function Home() {
  const { activeCycle, formSubmit, interruptCycle } = useContext(CyclesContext);

  const newCycleForm = useForm<FormData>(); // useForm: controlador do formulario
  const { watch, handleSubmit, reset } = newCycleForm;
  const taskWatcher = watch("task"); // useForm esta observando os inputs registrados
  const minutesWatcher = watch("minutesAmount"); // useForm esta observando os inputs registrados

  // controla o submit do formulario e reseta o form logo após !
  function handleFormSubmit(data: FormData) {
    formSubmit(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormProvider {...newCycleForm}>
          <CycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountDownButton onClick={interruptCycle} type="button">
            <TbHandStop size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton
            disabled={!taskWatcher || !minutesWatcher}
            type="submit"
          >
            <BiPlay size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}

export default Home;
