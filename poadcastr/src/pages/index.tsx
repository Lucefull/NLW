import { format, parseISO } from 'date-fns';
import ptBR  from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link'
import Head from 'next/head';


import styles from './home.module.scss';

import { usePlayer } from '../contexts/PlayerContext';

type Episode ={
  id: string;
  title:string;
  members: string;
  thumbnail: string;
  duration: number;
  durationAtString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes:Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {

  const { playList } = usePlayer();

  const episodeList = [ ...latestEpisodes, ...allEpisodes];

  return (
    
    <div className={styles.homepage}>
      <Head>
      <title>Home | Podcastr</title>
    </Head>
      <section className={styles.latestEpisodes}>
      <h2>Últimos Lançamentos</h2>
      <ul>
        {latestEpisodes.map((e,index) => {
          return(
            <li key={e.id}>
              <Image width={192} height={192} src={e.thumbnail} alt={e.title} objectFit="cover"/>
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${e.id}`}>
                  <a >{e.title}</a>
                </Link>
                
                <p>{e.members}</p>
                <span>{e.publishedAt}</span>
                <span>{e.durationAtString}</span>
              </div>

              <button type="button" onClick={ ()=>playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Play episodio"/>
              </button>
            </li>
          )
        })}
      </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((e,index)=>{
              return(
                <tr key = {e.id}>
                  <td>
                    <Image width={120} height={120} src={e.thumbnail} alt={e.title} objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${e.id}`}>
                    <a >{e.title}</a>
                    </Link>
                    
                  </td>
                  <td>{e.members}</td>
                  <td style={{ width:100 }}>{e.publishedAt}</td>
                  <td>{e.durationAtString}</td>
                  <td>
                    <button type="button" onClick={()=> playList(episodeList,index+latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episodio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
    
  )
}

export const getStaticProps:GetStaticProps = async ()=> {
  const {data} = await api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order:'desc'
    }
  })
  const episodes = data.map(episode=>{
    return {
      id: episode.id,
      title:episode.title,
      thumbnail:episode.thumbnail,
      members:episode.members,
      publishedAt: format(parseISO( episode.published_at),'d MMM yy', { locale:ptBR}),
      duration: Number(episode.file.duration),
      durationAtString:convertDurationToTimeString(Number(episode.file.duration)),
      url:episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2,episodes.length)

  return{
    props:{
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60*60*8,
  }
}