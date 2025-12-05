import { Send } from "lucide-solid";
import Container from "@/component/Container";

const HTTP_METHOD_OPTIONS = [
  {
    value: "GET",
    label: "GET",
    class: "text-primary",
  },
  {
    value: "POST",
    label: "POST",
    class: "text-secondary",
  },
  {
    value: "PUT",
    label: "PUT",
    class: "text-accent",
  },
  {
    value: "DELETE",
    label: "DELETE",
    class: "text-success",
  },
  {
    value: "OPTIONS",
    label: "OPTIONS",
    class: "text-warning",
  },
  {
    value: "HEAD",
    label: "HEAD",
    class: "text-info",
  },
];

export default function HttpClient() {
  return (
    <Container>
      <div class="flex items-center justify-center gap-2">
        <label class="input label w-full outline-none">
          <select class="select select-sm text-base-content w-25 border-none outline-none">
            {HTTP_METHOD_OPTIONS.map(({ label, value, class: _class }) => (
              <option value={value} class={_class}>
                {label}
              </option>
            ))}
          </select>
          <div class="divider divider-horizontal divider-neutral my-2"></div>
          <input
            type="text"
            placeholder="Enter URL"
            class="input text-base-content outline-none"
          />
        </label>
        <button class="btn btn-primary text-sm">
          <Send size={16} />
          发送
        </button>
      </div>

      <div class="tabs tabs-border">
        <input type="radio" name="request" class="tab" aria-label="参数" />
        <div class="tab-content bg-base-100 mt-2 rounded-md p-10">
          Tab content 1
        </div>

        <input
          type="radio"
          name="request"
          class="tab"
          aria-label="请求头"
          checked={true}
        />
        <div class="tab-content bg-base-100 mt-2 rounded-md p-10">
          Tab content 2
        </div>

        <input type="radio" name="request" class="tab" aria-label="包体" />
        <div class="tab-content bg-base-100 mt-2 rounded-md p-10">
          Tab content 3
        </div>
      </div>

      <div class="tabs tabs-border">
        <input
          type="radio"
          name="response"
          class="tab"
          aria-label="响应头"
          checked={true}
        />
        <div class="tab-content bg-base-100 mt-2 rounded-md p-10">
          Tab content 2
        </div>

        <input type="radio" name="response" class="tab" aria-label="包体" />
        <div class="tab-content bg-base-100 mt-2 rounded-md p-10">
          Tab content 3
        </div>
      </div>
    </Container>
  );
}
