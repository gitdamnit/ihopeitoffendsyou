import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type RoastInput } from "@shared/routes";

export function useRoasts() {
  return useQuery({
    queryKey: [api.roasts.list.path],
    queryFn: async () => {
      const res = await fetch(api.roasts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch roasts");
      return api.roasts.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRoast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RoastInput) => {
      const res = await fetch(api.roasts.create.path, {
        method: api.roasts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 500) {
           const error = api.roasts.create.responses[500].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create roast");
      }
      return api.roasts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roasts.list.path] });
    },
  });
}
