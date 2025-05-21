import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification.service';

export function handleValidationError(error: any, notificationService: NotificationService) {
  if (!(error instanceof HttpErrorResponse)) return;

  if (error.status === 400 && error.error?.errors) {
    const validationErrors = error.error.errors;
    const mensagens: string[] = [];

    for (const campo in validationErrors) {
      if (validationErrors.hasOwnProperty(campo)) {
        const errosCampo = validationErrors[campo];
        mensagens.push(...errosCampo);
      }
    }

    mensagens.forEach(msg => {
      notificationService.show(msg, 'error');
    });
  } else {
    notificationService.show('Erro ao salvar os dados. Tente novamente.', 'error');
  }
}
