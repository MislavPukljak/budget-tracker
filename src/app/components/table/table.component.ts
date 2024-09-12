import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TableDateConfig } from '../../interfaces/ui-config/table-data-config.interface';
import { UiService } from '../../services/ui.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  uiService = inject(UiService);

  @Input() data: TableDateConfig[] = [];
  @Output() removeRow: EventEmitter<TableDateConfig> = new EventEmitter();

  handleAction(item: TableDateConfig) {
    this.removeRow.emit(item);
  }
}
