import { Resource } from "solid-js";

export function isReady<T>(resource: Resource<T>) {
  return resource.state === "ready";
}

export function ready<T>(resource: Resource<T>) {
  if (resource.state === "ready") {
    return resource();
  }
}
