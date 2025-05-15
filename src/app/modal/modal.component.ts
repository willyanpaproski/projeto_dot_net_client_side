import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit {
  @Input() title: string = '';
  @Output() closeModal = new EventEmitter<void>();

  isMinimized = false;

  posX = 0;
  posY = 0;
  dragging = false;
  dragStartX = 0;
  dragStartY = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const modalEl = this.el.nativeElement.querySelector('.modal');
    if (modalEl) {
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const modalRect = modalEl.getBoundingClientRect();

      this.posX = (vpWidth - modalRect.width) / 2;
      this.posY = (vpHeight - modalRect.height) / 2;
      this.setPosition();
    }
  }

  setPosition() {
    const modalEl = this.el.nativeElement.querySelector('.modal');
    if (modalEl) {
      this.renderer.setStyle(modalEl, 'left', this.posX + 'px');
      this.renderer.setStyle(modalEl, 'top', this.posY + 'px');
      this.renderer.setStyle(modalEl, 'position', 'fixed');
      this.renderer.setStyle(modalEl, 'margin', '0');
    }
  }

  close() {
    this.closeModal.emit();
  }

  minimize() {
    this.isMinimized = true;
  }

  maximize() {
    this.isMinimized = false;
  }

  onDragStart(event: MouseEvent) {
    this.dragging = true;
    this.dragStartX = event.clientX - this.posX;
    this.dragStartY = event.clientY - this.posY;

    event.preventDefault();
  }

  @HostListener('document:mouseup', ['$event'])
  onDragEnd(event: MouseEvent) {
    this.dragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (this.dragging) {
      this.posX = event.clientX - this.dragStartX;
      this.posY = event.clientY - this.dragStartY;

      const modalEl = this.el.nativeElement.querySelector('.modal');
      if (modalEl) {
        const maxX = window.innerWidth - modalEl.offsetWidth;
        const maxY = window.innerHeight - modalEl.offsetHeight;

        if (this.posX < 0) this.posX = 0;
        if (this.posY < 0) this.posY = 0;
        if (this.posX > maxX) this.posX = maxX;
        if (this.posY > maxY) this.posY = maxY;
      }

      this.setPosition();
    }
  }
}

