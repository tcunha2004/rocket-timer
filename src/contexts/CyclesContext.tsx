import { differenceInSeconds } from "date-fns";
import { produce } from "immer";
import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setAmountSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
  formSubmit: (data: CreateCycleData) => void;
  interruptCycle: () => void;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date; // opcional
  finishedDate?: Date; // opcional
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

const ActionTypes = {
  ADD_NEW_CYCLE: "ADD_NEW_CYCLE",
  INTERRUPT_CYCLE: "INTERRUPT_CYCLE",
  MARK_CYCLE_AS_FINISHED: "MARK_CYCLE_AS_FINISHED",
} as const;

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // estado de ciclos que facilita a alteração e controle dos itens

  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
          // pega o estado atual e cria um rascunho novo
          return produce(state, (draft) => {
            draft.cycles.push(action.payload.data); // adiciona novo array
            draft.activeCycleId = action.payload.data.id; // muda o activeCycleId
          });

        case ActionTypes.INTERRUPT_CYCLE:
          const currentActiveCycleIndex = state.cycles.findIndex((cycle) => {
            return cycle.id == state.activeCycleId;
          });

          return produce(state, (draft) => {
            draft.cycles[currentActiveCycleIndex].interruptedDate = new Date();
            draft.activeCycleId = null;
          });
        case ActionTypes.MARK_CYCLE_AS_FINISHED:
          const currentActiveCycleIndexx = state.cycles.findIndex((cycle) => {
            return cycle.id == state.activeCycleId;
          });

          return produce(state, (draft) => {
            draft.cycles[currentActiveCycleIndexx].finishedDate = new Date();
            draft.activeCycleId = null;
          });
        default:
          return state;
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        "@timer: cycles-state-1.0"
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    }
  );

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), activeCycle.startDate);
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@timer: cycles-state-1.0", stateJSON);
  }, [cyclesState]);

  function formSubmit(data: CreateCycleData) {
    // crio um novo ciclo (seguindo a interface de como deve ser um ciclo)
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        data: newCycle,
      },
    });

    setAmountSecondsPassed(0); // volta pra 0 quando criar um novo ciclo @D058
  }

  function interruptCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CYCLE,
      payload: {
        data: activeCycleId,
      },
    });
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setAmountSecondsPassed,
        formSubmit,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
