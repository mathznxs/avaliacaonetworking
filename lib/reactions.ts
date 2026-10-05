export const reactionOptions = [
  { emoji: "👏", label: "Muito bem!", description: "Boa apresentação e trabalho bem feito." },
  { emoji: "💡", label: "Ideia criativa", description: "Uma proposta inteligente ou inovadora." },
  { emoji: "😍", label: "Encantou", description: "A empresa causou uma ótima impressão." },
  { emoji: "🚀", label: "Tem potencial", description: "A ideia pode crescer e ir ainda mais longe." },
  { emoji: "🔥", label: "Foi destaque", description: "A empresa chamou bastante atenção na feira." },
] as const

export const allowedReactionEmojis = new Set<string>(reactionOptions.map(({ emoji }) => emoji))

export function getReactionLabel(emoji: string | null) {
  return reactionOptions.find((option) => option.emoji === emoji)?.label ?? "Sem reação"
}
