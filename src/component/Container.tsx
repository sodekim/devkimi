import { createContextProvider } from "@solid-primitives/context";
import { children, createSignal, Index, JSX } from "solid-js";
import Card from "./Card";

export default function Container(props: {
  children: JSX.Element;
  class?: string;
}) {
  const _children = children(() => props.children);
  const cards = [<Card title="Card1"></Card>, <Card title="Card2"></Card>];
  return (
    <div class="flex h-0 w-full flex-1 flex-row">
      <CardMaximizableProvider>
        {cards.map((card, index) => (
          <CardIndexProvider index={index}>{card}</CardIndexProvider>
        ))}
      </CardMaximizableProvider>
    </div>
  );
}

const [CardIndexProvider, useCardIndex] = createContextProvider(
  (props: { index: number; children: JSX.Element }) => {
    const { setState } = useCardMaximizable()!;
    setState(props.index, true);
    return props.index;
  },
);

const [CardMaximizableProvider, useCardMaximizable] = createContextProvider(
  (props: { children: JSX.Element }) => {
    const [states, setStates] = createSignal<boolean[]>([]);
    const getState = (index: number) => states()[index];
    const setState = (index: number, value: boolean) => {
      setStates((prev) => {
        const _states = [...prev];
        _states[index] = value;
        return _states;
      });
    };
    return { getState, setState };
  },
);

export { useCardIndex, useCardMaximizable };
