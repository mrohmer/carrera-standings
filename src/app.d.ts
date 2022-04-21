/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {PrismaFactory} from './lib/db/client-factory';

declare namespace App {
  interface Locals {
    prisma: PrismaFactory;
  }
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
