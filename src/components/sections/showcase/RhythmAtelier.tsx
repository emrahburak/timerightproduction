import ShowcaseItem from './ShowcaseItem';
interface Props { title: string; subtitle: string; description: string; stat: string; }
export default function RhythmAtelier({ title, subtitle, description, stat }: Props) { return <ShowcaseItem title={title} subtitle={subtitle} description={description} stat={stat} bgColor='bg-[#111111]' />; }
