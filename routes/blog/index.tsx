/** @jsx h */
/** @jsxFrag Fragment */
import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { Fragment, h } from 'preact';
import { Post, readPosts } from '../../libs/posts.ts';
import { tw } from '../../utils/twind.ts';

export const handler: Handlers<Array<Post>> = {
  async GET(_req, ctx) {
    const posts = await readPosts();

    return ctx.render(
      posts.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else if (a.date > b.date) {
          return -1;
        } else {
          return 0;
        }
      })
    );
  },
};

export default function BlogPostsPage(props: PageProps<Array<Post>>) {
  const posts = props.data;

  return (
    <>
      <Head>
        <title>記事一覧</title>
      </Head>
      <main>
        <div class={tw`container mx-auto py-12 flex flex-col gap-y-10`}>
          <section>
            <h1>記事一覧</h1>
          </section>
          <section>
            <div class={tw`flex flex-col gap-y-6`}>
              {posts.map((post) => {
                return (
                  <article key={post.slug} class={tw`flex flex-col gap-y-1`}>
                    <header>{post.date}</header>
                    <div>
                      <a href={`blog/${post.slug}`}>{post.title}</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
