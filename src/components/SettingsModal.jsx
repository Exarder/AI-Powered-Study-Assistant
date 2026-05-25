import { useEffect, useState } from "react";
import { DEFAULT_CHAT_CONFIG } from "../utils/storage";

const MODEL_OPTIONS = [{ value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" }];

export default function SettingsModal({ open, onClose, apiKey, chatConfig, onSave }) {
    const [localKey, setLocalKey] = useState(apiKey);
    const [config, setConfig] = useState(chatConfig);

    useEffect(() => {
        if (open) {
            setLocalKey(apiKey);
            setConfig(chatConfig);
        }
    }, [open, apiKey, chatConfig]);

    if (!open) return null;

    function handleSave(e) {
        e.preventDefault();
        onSave(localKey, config);
    }

    function handleResetPrompt() {
        setConfig((c) => ({ ...c, baseSystemPrompt: DEFAULT_CHAT_CONFIG.baseSystemPrompt }));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Tutup" onClick={onClose} />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2 id="settings-title" className="text-lg font-semibold text-slate-900">
                        Pengaturan
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Tutup dialog"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5 p-5">
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-slate-900">Google AI Studio API Key</legend>
                        <p className="text-xs text-slate-500">
                            Dapatkan di{" "}
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                            >
                                aistudio.google.com/apikey
                            </a>
                            . Disimpan di localStorage browser Anda.
                        </p>
                        <input
                            type="password"
                            value={localKey}
                            onChange={(e) => setLocalKey(e.target.value)}
                            placeholder="AIza..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-600 focus:ring-2"
                            autoComplete="off"
                        />
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-slate-900">Chat Config</legend>

                        <label className="block text-xs font-medium text-slate-600">Model Gemini</label>
                        <select
                            value={config.model}
                            onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-600 focus:ring-2"
                        >
                            {MODEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <label className="mt-3 block text-xs font-medium text-slate-600">
                            Temperature ({config.temperature}) — kreativitas AI
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={config.temperature}
                            onChange={(e) => setConfig((c) => ({ ...c, temperature: parseFloat(e.target.value) }))}
                            className="w-full accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Fokus (0)</span>
                            <span>Kreatif (1)</span>
                        </div>

                        <label className="mt-3 block text-xs font-medium text-slate-600">Mata kuliah (opsional)</label>
                        <input
                            type="text"
                            value={config.course}
                            onChange={(e) => setConfig((c) => ({ ...c, course: e.target.value }))}
                            placeholder="Contoh: Algoritma & Struktur Data"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-600 focus:ring-2"
                        />

                        <label className="mt-3 block text-xs font-medium text-slate-600">
                            System Prompt dasar (kustomisasi)
                        </label>
                        <textarea
                            value={config.baseSystemPrompt}
                            onChange={(e) => setConfig((c) => ({ ...c, baseSystemPrompt: e.target.value }))}
                            rows={4}
                            placeholder="Instruksi tambahan untuk tutor AI..."
                            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-600 focus:ring-2"
                        />
                        <button
                            type="button"
                            onClick={handleResetPrompt}
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            Reset prompt kustom
                        </button>
                    </fieldset>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
