import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
          isUser
            ? 'bg-slate-900 text-white'
            : 'border border-slate-200 bg-white text-indigo-600'
        }`}
      >
        {isUser ? 'Anda' : 'AI'}
      </div>
      <div
        className={`max-w-[85%] rounded-lg border px-4 py-3 sm:max-w-[75%] ${
          isUser
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-800'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
