"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AskField() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/research");
  }

  return (
    <form className="ask" onSubmit={onSubmit}>
      <input name="question" placeholder="Ask about a patient or a drug…" aria-label="Ask about a patient or a drug" />
      <button type="submit" className="ask-submit" aria-label="Ask">
        ↵
      </button>
    </form>
  );
}
