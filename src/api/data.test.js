import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/axios";
import { useData } from "../api/data";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("useData multilingual menu loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the selected language to the backend", async () => {
    const payload = {
      restaurant: { name: "Restaurant" },
      categories: [],
      meals: [],
    };
    api.get.mockResolvedValue({ data: payload });

    const { result } = renderHook(() => useData());

    await act(async () => {
      await result.current.fetchData("restaurant-slug", "fr");
    });

    expect(api.get).toHaveBeenCalledWith("/menu/restaurant-slug", {
      params: { lang: "fr" },
    });
    expect(result.current.restau).toEqual(payload);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("falls back to English for an unsupported language", async () => {
    api.get.mockResolvedValue({
      data: { restaurant: { name: "Restaurant" }, categories: [], meals: [] },
    });

    const { result } = renderHook(() => useData());

    await act(async () => {
      await result.current.fetchData("restaurant-slug", "de");
    });

    expect(api.get).toHaveBeenCalledWith("/menu/restaurant-slug", {
      params: { lang: "en" },
    });
  });

  it("does not keep stale menu data when the backend request fails", async () => {
    api.get.mockRejectedValue({
      response: { data: { message: "Unable to translate menu" } },
    });

    const { result } = renderHook(() => useData());

    await act(async () => {
      await result.current.fetchData("restaurant-slug", "ar");
    });

    expect(result.current.restau).toBeNull();
    expect(result.current.error).toBe("Unable to translate menu");
    expect(result.current.loading).toBe(false);
  });
});
