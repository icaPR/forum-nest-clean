import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number) {
    return a === b;
  }
}

describe("WackedList", () => {
  it("should be able to create a watched list with iniial items", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toEqual([1, 2, 3]);
  });
  it("should be able to add new items to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);

    expect(list.getNewItems()).toEqual([4]);
  });
  it("should be able to remove items from the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);

    expect(list.getRemovedItems()).toEqual([2]);
  });
  it("should be able to add an item even if it was removed before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);
    list.add(2);

    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.currentItems).toHaveLength(3);
  });
  it("should be able to remove an item even if it was removed before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);
    list.remove(4);

    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.currentItems).toHaveLength(3);
  });
  it("should be able to update watched list items", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.update([1, 3, 5]);

    expect(list.getNewItems()).toEqual([5]);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.currentItems).toHaveLength(3);
  });
});
