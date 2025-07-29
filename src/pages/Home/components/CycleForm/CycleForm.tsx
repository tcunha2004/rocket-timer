import { useContext } from "react";
import { DurationInput, FormContainer, TaskInput } from "./styles";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";

function CycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Dê um nome para a sua tarefa"
        list="task-suggestions"
        {...register("task")} // registrando os inputs pro useForm controlar
        disabled={!!activeCycle} // !! -> boolean (tem algum valor?)
      />

      <datalist id="task-suggestions">
        <option value="Study" />
        <option value="Clean the kitchen" />
      </datalist>

      <label htmlFor="durationMinutes">durante</label>
      <DurationInput
        type="number"
        id="durationMinutes"
        placeholder="00"
        step={1}
        min={1}
        max={60}
        {...register("minutesAmount", { valueAsNumber: true })} // registrando os inputs pro useForm controlar
        disabled={!!activeCycle} // !! -> boolean (tem algum valor?)
      />

      <span>minutos</span>
    </FormContainer>
  );
}

export default CycleForm;
