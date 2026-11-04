import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import api from "./axios";
import { useData } from "./data";

vi.mock("./axios", () => ({
  default: { get: vi.fn() },
}));

describe("useData", () => {
  afterEach(() => vi.clearAllMocks());

  it.each(["en", "fr", "ar"])("requests the menu in %s", async (language) => {
    const payload = { restaurant: { name: "Restaurant" }, categories: [], meals: [] };
    vi.mocked(api.get).mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useData());

    await act(async () => {
      await result.current.fetchData("demo-restaurant", language);
    });

    expect(api.get).toHaveBeenCalledWith("/menu/demo-restaurant", {
      params: { lang: language },
    });
    await waitFor(() => expect(result.current.restau).toEqual(payload));
    expect(result.current.error).toBeNull();
  });

  it("does not call the API when the restaurant slug is missing", async () => {
    const { result } = renderHook(() => useData());

    await act(async () => {
      await result.current.fetchData("", "ar");
    });

    expect(api.get).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Restaurant slug is missing.");
  });
});
