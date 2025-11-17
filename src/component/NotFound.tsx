import { useNavigate } from "@solidjs/router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>404 Not Found</h1>
      <button class="btn" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}
