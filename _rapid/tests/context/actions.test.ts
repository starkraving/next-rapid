import * as actions from '../../context/actions';
describe('actions', () => {
  it('setProject returns correct action', () => {
    const project = { routes: {}, global: { links: [], forms: [] } };
    expect(actions.setProject(project)).toEqual({ type: actions.SET_PROJECT, payload: project });
  });
  // Add similar tests for each action creator
});
