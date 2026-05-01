'use client';

/**
 * React class-based ErrorBoundary. Vangt runtime fouten in client-children
 * op en toont een nette fallback met "Naar startscherm" knop. We loggen
 * de error op de console zodat dev-stack-traces zichtbaar blijven.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';
import { Card } from './Card';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message ?? null };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] runtime error', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    const title = this.props.fallbackTitle ?? 'Er ging iets onverwachts mis';
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <Card padding="lg">
            <div className="flex flex-col gap-4 items-start">
              <h1 className="text-xl font-semibold text-purple-dark">
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-text-body">
                We konden dit scherm niet tonen. Probeer terug te gaan naar het
                startscherm en het examen opnieuw te starten. Blijft het
                gebeuren, neem dan contact op met de examencommissie.
              </p>
              {this.state.message ? (
                <p className="text-xs text-text-body/70 break-words">
                  Technische melding: {this.state.message}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/start"
                  className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base bg-purple-primary text-white hover:bg-purple-dark transition-colors min-h-[44px]"
                  onClick={this.handleReset}
                >
                  Naar startscherm
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }
}
