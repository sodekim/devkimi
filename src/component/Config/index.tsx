import { JSX } from "solid-js";
import Container from "../Container";
import { Input, NumberInput } from "./Input";
import Option from "./Option";
import Select from "./Select";
import Switch from "./Switch";

const Card = ({ label = "配置", children }: { label?: string, children?: JSX.Element }) => {
  return (
    <Container class="gap-4">
      <span class="text-sm">{label}</span>
      <div class="flex flex-col items-center gap-2">
        {children}
      </div>
    </Container>);
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
