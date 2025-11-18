import { children, JSX } from "solid-js";
import Container from "../Container";
import { Input, NumberInput } from "./Input";
import Option from "./Option";
import Select from "./Select";
import Switch from "./Switch";

const Card = (props: { label?: string; children?: JSX.Element }) => {
  const _children = children(() => props.children);
  return (
    <Container class="gap-4">
      <span class="text-sm">{props.label}</span>
      <div class="flex flex-col items-center gap-2">{_children()}</div>
    </Container>
  );
};

const Config = {
  Option,
  Switch,
  Select,
  Input,
  NumberInput,
  Card,
};

export default Config;
