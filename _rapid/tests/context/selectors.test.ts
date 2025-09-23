import * as selectors from '../../context/selectors';
describe('selectors', () => {
  const state = {
    project: { routes: { foo: { links: [], forms: [] } }, global: { links: [], forms: [] } },
    currentRoute: 'foo',
    currentFormIndex: 1,
    isEditing: true,
    isPreviewing: false,
    isPublishing: false,
    selectedRoutes: ['foo'],
  };
  it('selectProject returns project', () => {
    expect(selectors.selectProject(state)).toBe(state.project);
  });
  // More selector tests for each selector
});
