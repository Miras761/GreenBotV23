import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role } from '../types';
import { MessageBubble } from './MessageBubble';
import { generateText, generateTextWithImage } from '../services/geminiService';
import { ImagePreview } from './ImagePreview';
import { UploadIcon, SendIcon, TypingIcon } from './icons';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: Role.Model, text: "Hello! I'm GreenBot. How can I help you today? You can also upload an image." }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !image) return;

    const userMessage: Message = { role: Role.User, text: input };
    if (imagePreview) {
      userMessage.image = imagePreview;
    }
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');
    clearImage();

    try {
      let modelResponse: string;
      if (image) {
        modelResponse = await generateTextWithImage(input, image);
      } else {
        modelResponse = await generateText(input);
      }
      setMessages(prev => [...prev, { role: Role.Model, text: modelResponse }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setMessages(prev => [...prev, { role: Role.Error, text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const files = e.dataTransfer.files;
    if(files && files.length > 0){
        if(files[0].type.startsWith('image/')){
            handleFileChange(files);
        }
    }
  }

  return (
    <div 
        className={`flex-grow flex flex-col bg-gray-800 rounded-lg shadow-lg border border-gray-700 relative ${isDragging ? 'outline-dashed outline-4 outline-green-500' : ''}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
    >
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
              <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg inline-flex">
                 <TypingIcon className="h-6 w-6 text-green-400" />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        {imagePreview && <ImagePreview src={imagePreview} onRemove={clearImage} />}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-green-400 hover:bg-gray-700 transition-colors"
          >
            <UploadIcon className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or drop an image..."
            className="flex-grow px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-600 transition-colors"
            disabled={isLoading || (!input.trim() && !image)}
          >
            <SendIcon className="h-6 w-6"/>
          </button>
        </form>
      </div>
      {isDragging && (
          <div className="absolute inset-0 bg-green-900 bg-opacity-50 flex items-center justify-center pointer-events-none rounded-lg">
              <p className="text-2xl font-bold text-green-300">Drop image here</p>
          </div>
      )}
    </div>
  );
};
