type State = {
  externalData: unknown;
  updatedAt?: number;
};

const state: State = { externalData: null };

export const storage = {
  get: () => state,
  setExternalData: (data: unknown) => {
    state.externalData = data;
    state.updatedAt = Date.now();
  },
};
