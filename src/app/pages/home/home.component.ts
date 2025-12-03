import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, effect, signal, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MarkdownDialogComponent } from 'src/app/shared/components/markdown-dialog/markdown-dialog.component';

import { InputTextModule } from 'primeng/inputtext';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AudioTourService } from 'src/app/services/audio-tour.service';
import { stepsIntro } from './steps-tour-home';
import { AgentCardService } from 'src/app/services/agent-card-service';
import { AgentCardUI, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ILesson } from '@dataclouder/ngx-lessons';
import { LESSONS_TOKEN } from '@dataclouder/ngx-lessons';

// Define card interface for type safety
interface CardItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  content: string;
  externalLink?: string;
}

register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, InputTextModule, CardModule, AgentCardUI],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class HomeComponent implements OnInit {
  // Services
  private audioTourService = inject(AudioTourService);
  private dialogService = inject(DialogService);
  private lessonsService = inject(LESSONS_TOKEN);
  private agentCardService = inject(AgentCardService);

  // Input States
  agentCards = signal<IAgentCard[]>([]);
  dailyAgentCard = signal<IAgentCard>({} as IAgentCard);
  lessons = signal<ILesson[]>([]);

  // View Child
  readonly swiperRef = viewChild<ElementRef>('mainSwiper');

  // States
  isDarkMode = false;
  swiper?: Swiper; // You might not need this property if you access via swiperRef().nativeElement.swiper
  // https://adamofig.notion.site/Aprende-los-Fundamentos-de-Control-Markets-2bdec05dc75e804c8cb8e55f153ef5ad
  // Card data using signal for reactivity
  cards = signal<CardItem[]>([
    {
      imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000',
      title: 'Fundamentos',
      subtitle: 'Entiende que es y como funciona Control Markets',
      content: 'Fundamentos Teoricos para comenzar a utilizar Control Markets',
      externalLink: 'https://adamofig.notion.site/Aprende-los-Fundamentos-de-Control-Markets-2bdec05dc75e804c8cb8e55f153ef5ad',
    },
    {
      imageUrl: 'assets/defaults/images/default-feature-1.jpg',
      title: 'Creación de contenido',
      subtitle: 'Crea contenido con Agentes',
      content: 'Aprende a crear un agente, darle personaliza y utilizalo en algun flujo para generar contenido',
      externalLink: 'https://adamofig.notion.site/Como-clonar-voces-2bdec05dc75e80419008d34b8e386be0',
    },
    {
      imageUrl: 'assets/defaults/images/voice.jpg',
      title: 'Clonar voces',
      subtitle: 'Genera una nueva voz ',
      content: 'Aprende los pasos para clonar una voz que puedas utilizar en tus videos.',
      externalLink: 'https://adamofig.notion.site/Como-clonar-voces-2bdec05dc75e80419008d34b8e386be0',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1648437595587-e6a8b0cdf1f9?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000',
      title: 'Ejercicio de flujo',
      subtitle: 'Agente para la taquería',
      content: 'Aprenderás a crear un flujo completo, el agente la tarea y contexto de la taquería ',
      externalLink: 'https://www.notion.so/adamofig/Ejercicio-de-Flujo-de-Agentes-2beec05dc75e8012a16fde468264ebec',
    },
  ]);

  constructor() {
    // Add an effect to react when swiperRef is available
    effect(() => {
      const swiperElement = this.swiperRef()?.nativeElement;
      if (swiperElement) {
        console.log('Swiper reference is now available:', swiperElement);
      } else {
        console.log('Swiper reference not available yet.');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const agents = await this.agentCardService.getRandomAgentCard();
    this.dailyAgentCard.set(agents[0]);
    const lessons = await this.lessonsService.getLessons({});

    this.lessons.set(lessons.rows);
  }

  public startTour(): void {
    this.audioTourService.setupTour(stepsIntro);
    this.audioTourService.startTour();
  }

  swiperSlideChanged(e: any) {
    const index = e.target.swiper.activeIndex;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }

  public goToLesson(lesson: any) {
    console.log('goToLesson', lesson);
  }

  public handleAction(event: any) {
    console.log('handleAction', event);
  }

  public openMarkdownDialog(card: CardItem): void {
    this.dialogService.open(MarkdownDialogComponent, {
      header: card.title,
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      closable: true,
      data: {
        content: card.content,
      },
    });
  }

  public openExternalLink(card: CardItem): void {
    if (card.externalLink) {
      window.open(card.externalLink, '_blank');
    }
  }
}
