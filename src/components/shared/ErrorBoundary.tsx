"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/lib/logger";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Error in module ${this.props.moduleName || 'Unknown'}: ${error.message}`, {
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 flex flex-col items-center justify-center text-center gap-2">
          <h2 className="text-red-500 font-black text-lg">Algo salió mal.</h2>
          <p className="text-red-400 text-sm">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-4 py-2 bg-red-900/50 hover:bg-red-900/80 text-white text-xs font-bold rounded-lg transition"
          >
            Intentar nuevamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
