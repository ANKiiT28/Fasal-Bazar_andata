
"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const forumPosts = [
    {
        id: 1,
        author: { name: "Ramesh K.", avatar: "https://picsum.photos/seed/ramesh/100", role: "Farmer" },
        content: "What is the best natural pesticide for tomato plants? I'm seeing some whiteflies on my crop.",
        likes: 12,
        comments: 3,
        timestamp: "2 hours ago",
    },
    {
        id: 2,
        author: { name: "Anjali S.", avatar: "https://picsum.photos/seed/anjali/100", role: "Buyer" },
        content: "Looking for a reliable source of organic carrots in the Pune area. Any recommendations?",
        likes: 8,
        comments: 5,
        timestamp: "5 hours ago",
    },
    {
        id: 3,
        author: { name: "Vikram P.", avatar: "https://picsum.photos/seed/vikram/100", role: "Farmer" },
        content: "Good news! The new government scheme for solar water pumps is now live. Has anyone applied yet?",
        likes: 25,
        comments: 10,
        timestamp: "1 day ago",
    },
];


export default function CommunityForumPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Community Forum</h1>
                        <p className="text-muted-foreground">Ask questions, share tips, and connect with other farmers and buyers.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Create a New Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="What's on your mind?" />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Post
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-4">
                        {forumPosts.map(post => (
                            <Card key={post.id}>
                                <CardHeader className="flex flex-row gap-3 items-start">
                                    <Avatar>
                                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{post.author.name}</p>
                                            <span className="text-xs text-muted-foreground">• {post.author.role}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{post.content}</p>
                                </CardContent>
                                <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>{post.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{post.comments} Comments</span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
