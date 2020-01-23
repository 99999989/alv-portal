import { FilterByKeyValuePipe } from './filter-by-key-value.pipe';

describe('FilterByKeyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByKeyValuePipe();
    expect(pipe).toBeTruthy();
  });
});
