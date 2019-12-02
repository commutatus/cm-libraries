import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { deepCopy } from './modular.functions';

interface ItemType {
  id: number;
  value: string;
  name: string;
  text: string;
  checked: boolean;
  showAlphabet: boolean;
}
class Options {
  filter: boolean;
  image: boolean;
  imageUrlKey: string;
  single: boolean;

  constructor(option) {
    this.filter = option ? option.filter : false;
    this.image = option ? option.image : false;
    this.imageUrlKey = option ? option.imageUrl : null;
    this.single = option ? option.single : false;
  }
}

@Component({
  selector: 'lib-cm-filter-checkbox',
  templateUrl: './cm-filter-checkbox.component.html',
  styleUrls: ['./cm-filter-checkbox.component.scss'],
})

export class CmFilterCheckboxComponent implements OnInit {

  @Input() options: Options = new Options(null);
  @Input() bindLabel = 'value';
  @Input() bindValue = 'id';
  @Input() data: Array<any> = [];
  @Input() additionalData: any;
  @Input() selectedData: Array<ItemType> = [];
  @Input() selectedIds: Array<number> = [];
  @Input() additionalSelectedData: any = {};
  @Input() additionalSelectedIds: any = {};
  @Input() isMobile = false;
  @Output() dataChanged: EventEmitter<Array<ItemType>> = new EventEmitter();
  @Output() idsChanged: EventEmitter<Array<number>> = new EventEmitter();
  @Output() itemChanged: EventEmitter<ItemType> = new EventEmitter();
  @Output() additionalDataChanged: EventEmitter<any> = new EventEmitter();
  @Output() additionalIdsChanged: EventEmitter<any> = new EventEmitter();

  filteredItems: Array<ItemType>;
  additionalFilteredItems: any;
  object = Object;
  items: Array<ItemType>;
  additionalItems: any;
  alphabets: Array<string>;
  activeLetters: any = {};
  hoveredAlphabet: string;
  hasAdditionalFilterSelection = false;
  search: string;

  constructor() { }

  ngOnInit() {
    if (this.data && this.data.length) {
      this.data = this.data.sort((a, b) => {
        if (a[this.bindLabel].toLowerCase() < b[this.bindLabel].toLowerCase()) {
          return -1;
        }
        if (a[this.bindLabel].toLowerCase() > b[this.bindLabel].toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    this.items = this.getCheckmarkedSelectedItems(this.data, this.selectedData, this.selectedIds);
    this.filteredItems = this.items;
    if (this.options.filter) {
      this.updateAlphabetGrouping();
    }
    if (this.additionalData) {
      this.additionalFilteredItems = this.getAdditionalItems(this.additionalData, this.additionalSelectedData, this.additionalSelectedIds);
    }

    if (this.options.filter) {
      this.alphabets = this.makeAlphabets();
      this.setActiveLetters();
    }
  }

  getAdditionalItems(additionalData, additionalSelectedDataObjects, additionalSelectedDataIds) {
    const keys = Object.keys(additionalData);

    const additionalItems = {};
    for (const key of keys) {
      additionalItems[key] =
      this.getCheckmarkedSelectedItems(additionalData[key], additionalSelectedDataObjects[key], additionalSelectedDataIds[key]);
    }
    return additionalItems;
  }

  getCheckmarkedSelectedItems(items: Array<ItemType>, selectedDataObjects: Array<ItemType>, selectedDataIds: Array<number>) {
    const selectedData = selectedDataObjects && selectedDataObjects.length ? selectedDataObjects : selectedDataIds;
    const data = deepCopy(items);

    if (!selectedData) {
      return data;
    }

    for (const item of selectedData) {
      for (const i of data) {
        if (this.isItemSame(i, selectedDataObjects && selectedDataObjects.length ? item : null, item)) {
          i.checked = true;
          break;
        }
      }
    }

    return data;
  }

  triggerChange(item: ItemType) {
    let data;
    if (this.options.single) {
      this.items.forEach(i => {
        if (i.checked && i[this.bindValue] === item[this.bindValue]) {
          data = [i];
        } else {
          i.checked = false;
        }
      });
    } else {
      data = this.items.filter(i => i.checked);
    }

    if (!data) {
      data = [];
    }
    this.dataChanged.emit(data);
    this.idsChanged.emit(data.map(i => i[this.bindValue]));
    this.itemChanged.emit(item);
  }

  triggerAdditionalChange(item: ItemType) {
    const data = {};
    const additionalIdsChanged = {};

    this.hasAdditionalFilterSelection = false;
    const keys = Object.keys(this.additionalFilteredItems);
    if (this.options.single) {
      for (const key of keys) {
        this.additionalFilteredItems[key].forEach(i => {
          if (i.checked && i[this.bindValue] === item[this.bindValue]) {
            data[key] = [i];
            additionalIdsChanged[key] = [i[this.bindValue]];
            this.hasAdditionalFilterSelection = true;
          } else {
            i.checked = false;
          }
        });
        if (data) {
          break;
        }
      }
    } else {
      Object.keys(this.additionalFilteredItems).forEach(key => {
        const additionalData = this.additionalFilteredItems[key].filter(i => i.checked);
        if (additionalData.length) {
          this.hasAdditionalFilterSelection = true;
        }
        data[key] = additionalData;
        additionalIdsChanged[key] = additionalData.map(i => i[this.bindValue]);
      });
    }

    this.additionalDataChanged.emit(data);
    this.additionalIdsChanged.emit(additionalIdsChanged);
  }

  filterData(q: string) {
    this.items = this.items.filter(d => d[this.bindLabel].indexOf(q) > -1);
  }

  isItemSame(item1, item2?, id?) {
    if (item2) {
      return +item1[this.bindValue] === +item2[this.bindValue];
    } else {
      return +item1[this.bindValue] === +id;
    }
  }

  clearSelections() {
    Object.keys(this.additionalFilteredItems).forEach(key => {
      for (const item of this.additionalFilteredItems[key]) {
        item.checked = false;
      }
    });

    for (const item of this.items) {
      item.checked = false;
    }

    this.dataChanged.emit(null);
    this.idsChanged.emit(null);
    this.itemChanged.emit(null);
    if (this.additionalData) {
      this.triggerAdditionalChange(null);
    }
  }

  updateData(q) {
    this.activeLetters = {};
    q = q.toLowerCase();
    this.filteredItems = this.items.filter((i, index) => {
      if (i[this.bindLabel].toLowerCase().indexOf(q) > -1) {
        this.activeLetters[i[this.bindLabel].charAt(0).toUpperCase()] = true;
        return true;
      }
      return false;
    });
    if (this.options.filter) {
      this.updateAlphabetGrouping();
    }
    Object.keys(this.additionalData).forEach(key => {
      this.additionalFilteredItems[key] = this.additionalData[key].filter(i => {
        if (i[this.bindLabel].toLowerCase().indexOf(q) > -1) {
          this.activeLetters[i[this.bindLabel].charAt(0).toUpperCase()] = true;
          return true;
        }
        return false;
      });
    });
  }

  updateAlphabetGrouping() {
    this.filteredItems.forEach((item, index) => {
      item.showAlphabet = false;
      if (this.filteredItems[index]) {
        if (index === 0 || (this.filteredItems[index - 1] &&
          this.filteredItems[index - 1][this.bindLabel].toLowerCase().charAt(0) !==
          this.filteredItems[index][this.bindLabel].toLowerCase().charAt(0))) {
          if (this.filteredItems[index][this.bindLabel].toLowerCase().charCodeAt(0) > 96
          && this.filteredItems[index][this.bindLabel].toLowerCase().charCodeAt(0) < 123) {
            item.showAlphabet = true;
          }
        }
      }
    });
  }

  makeAlphabets() {
    const alphabets = [];
    let currentChar = 'A';
    while (currentChar !== '[') {
      alphabets.push(currentChar);
      currentChar = this.nextChar(currentChar);
    }
    return alphabets;
  }

  nextChar(c: string) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  setActiveLetters() {
    this.activeLetters = {};
    this.items.forEach(i => {
      this.activeLetters[i[this.bindLabel].charAt(0).toUpperCase()] = true;
    });
    Object.keys(this.additionalData).forEach(key => {
      this.additionalData[key].forEach(i => {
        this.activeLetters[i[this.bindLabel].charAt(0).toUpperCase()] = true;
      });
    });
  }

  scrollTo(c) {
    const ele = document.getElementById(`alphabet-${c}`);
    const scrollingDiv = document.getElementById('scrollingDiv');
    scrollingDiv.scroll({
      left: ele.offsetLeft,
      behavior: 'smooth'
    });
  }

}
