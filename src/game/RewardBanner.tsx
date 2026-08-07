type RewardBannerProps = {
  visible: boolean
}

export function RewardBanner({ visible }: RewardBannerProps) {
  if (!visible) return null
  return <div className="reward-banner">Solved!</div>
}
