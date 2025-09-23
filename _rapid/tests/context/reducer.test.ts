import { getInitialState } from '../../context/reducer';
describe('getInitialState', () => {
  it('returns the correct initial state', () => {
    expect(getInitialState()).toEqual({
      project: null,
      currentRoute: null,
      currentFormIndex: null,
      isEditing: false,
      isPreviewing: false,
      isPublishing: false,
      selectedRoutes: [],
    });
  });
});
// More reducer tests for each action type will be added
