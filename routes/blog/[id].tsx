/** @jsx h */
/** @jsxFrag Fragment */
import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { Fragment, h } from 'preact';
import { Post, readPost } from '../../libs/posts.ts';
import { tw } from '../../utils/twind.ts';

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await readPost(ctx.params.id);

    if (!post) {
      return new Response('404 Page not found', {
        status: 404,
      });
    }

    return ctx.render(post);
  },
};

export default function BlogPostPage(props: PageProps<Post>) {
  const { title, date, tags, body } = props.data;

  return (
    <>
      <Head>
        <title>{title ?? 'Not Found'}</title>
        <link rel="stylesheet" href={`/gfm.css?build=${__FRSH_BUILD_ID}`} />
      </Head>
      <main>
        <div class={tw`container mx-auto`}>
          <article class="markdown-body">
            <header>
              <h1>{title}</h1>
              <div>{date}</div>
            </header>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </article>
        </div>
      </main>
    </>
  );
}
