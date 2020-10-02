import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxParallaxService } from './rfx-parallax.service';

@Directive({
  selector: '[libRfxParallax]'
})
export class RfxParallaxDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public parallaxPercentage: number;
  @Input() public imageUrl: string;
  @Input() public imageZIndex: number;
  @Input() public visibleOverflow: boolean;
  @Input() public isDisabled: boolean;

  private image: HTMLImageElement;
  private availablePixels: number;
  private startPoint: number;
  private endPoint: number;

  private onScrollListener: Subscription;
  private onResizeListener: Subscription;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private rfxParallaxService: RfxParallaxService
  ) {
    this.parallaxPercentage = 20;
    this.imageZIndex = -1;
    this.isDisabled = false;
    this.visibleOverflow = false;
  }

  public ngOnInit(): void {
    this.setListeners();
  }

  public ngOnDestroy(): void {
    if (this.onScrollListener) {
      this.onScrollListener.unsubscribe();
    }

    if (this.onResizeListener) {
      this.onResizeListener.unsubscribe();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.imageUrl.currentValue) {
      this.loadImage(changes.imageUrl.currentValue);
    } else {
      this.setParallaxProperties();
    }
  }

  /**
   * Subscribe to scroll and resize listeners
   */
  private setListeners(): void {
    this.onScrollListener = this.rfxParallaxService.getMouseScroll().subscribe(() => {
      this.setImageTop(window.scrollY);
    });

    this.onResizeListener = this.rfxParallaxService.getWindowResize().subscribe(() => {
      this.setParallaxProperties();
    });
  }

  /**
   * Load parallax image from imageUrl
   * @param imageUrl image url
   */
  private loadImage(imageUrl: string): void {
    this.image = new Image();
    this.image.src = imageUrl;
    this.renderer.setStyle(this.image, 'visilibity', 'hidden');
    this.renderer.addClass(this.image, 'parallax-image');
    this.htmlElement.nativeElement.appendChild(this.image);

    this.image.onload = () => {
      this.setParallaxProperties();
      this.renderer.setStyle(this.image, 'visibility', 'visible');
    };
  }

  /**
   * Set parallax properties and position
   */
  private setParallaxProperties(): void {
    this.setStaticProperties();
    this.setImageSize();
    this.setParallaxValues(window.scrollY);
    this.setImageLeft(this.htmlElement.nativeElement.clientWidth);
    this.setImageTop(window.scrollY);
  }

  /**
   * Set default properties for container and image
   */
  private setStaticProperties(): void {
    if (!this.isAlreadyPositionAbsRel(this.htmlElement.nativeElement)) {
      this.renderer.setStyle(this.htmlElement.nativeElement, 'position', 'relative');
    }

    this.renderer.setStyle(this.htmlElement.nativeElement, 'overflow', this.visibleOverflow ? 'visible' : 'hidden');
    this.renderer.setStyle(this.image, 'z-index', this.imageZIndex);
    this.renderer.setStyle(this.image, 'position', 'absolute');
  }

  /**
   * Check if element has position absolute or relative
   * @param element html element
   */
  private isAlreadyPositionAbsRel(element: Element): boolean {
    return ['absolute', 'relative'].includes(window.getComputedStyle(element).position);
  }

  /**
   * Set default image size that match properties
   */
  private setImageSize(): void {
    const boxHeight = this.htmlElement.nativeElement.clientHeight;
    const boxWidth = this.htmlElement.nativeElement.clientWidth;
    const minHeight = (boxHeight * (100 + this.parallaxPercentage)) / 100;
    const ratio = this.image.naturalHeight / this.image.naturalWidth;
    const minRatio = minHeight / boxWidth;

    if (ratio > minRatio) {
      this.renderer.setStyle(this.image, 'width', `${boxWidth}px`);
      this.renderer.setStyle(this.image, 'height', 'auto');
    } else {
      this.renderer.setStyle(this.image, 'height', `${minHeight}px`);
      this.renderer.setStyle(this.image, 'width', 'auto');
    }
  }

  /**
   * Set available pixels and start & stop parallax points for better cpu usage
   * @param scrollTop pixels from the top of the page to the current view
   */
  private setParallaxValues(scrollTop: number): void {
    const elementPosition = this.htmlElement.nativeElement.getBoundingClientRect();
    this.availablePixels = this.image.height - elementPosition.height;
    this.startPoint = elementPosition.top + scrollTop - window.innerHeight;
    this.endPoint = elementPosition.top + scrollTop + elementPosition.height;
  }

  /**
   * Set image left property
   * @param containerWidth container width in pixels
   */
  private setImageLeft(containerWidth: number): void {
    const imageLeft: number = (containerWidth * (this.parallaxPercentage / 100) - containerWidth) / 2;
    this.renderer.setStyle(this.image, 'left', `-${imageLeft}px`);
  }

  /**
   * Set image top property
   * @param scrollTop pixels from the top of the page to the current view
   */
  private setImageTop(scrollTop: number): void {
    const imageTop: number = this.isDisabled ? (-this.availablePixels / 2) : this.getImageTop(scrollTop);
    this.renderer.setStyle(this.image, 'top', `${imageTop}px`);
  }

  /**
   * Get image top property
   * @param scrollTop pixels from the top of the page to the current view
   */
  private getImageTop(scrollTop: number): number {
    const parallaxPositionPixels = Math.min(this.endPoint - this.startPoint, Math.max(0, scrollTop - this.startPoint));
    const imageTop = (this.availablePixels / 100) * (100 - (100 * parallaxPositionPixels) / (this.endPoint - this.startPoint));
    return -imageTop;
  }
}