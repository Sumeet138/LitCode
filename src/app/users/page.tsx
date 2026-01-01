import { users } from "@/models/server/config"
import { UserPrefs } from "@/store/Auth"
import { Query } from "node-appwrite"
import Link from "next/link"
import slugify from "@/utils/slugify"
import { avatars } from "@/models/client/config"
import { IconTrophy, IconUsers, IconSearch } from "@tabler/icons-react"
import Pagination from "@/components/Pagination"
import { Particles } from "@/components/magicui/particles"

const UsersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>
}) => {
    const { page, search } = await searchParams
    const currentPage = parseInt(page || "1")
    const limit = 20

    // Build queries
    const queries = [
        Query.offset((currentPage - 1) * limit),
        Query.limit(limit),
    ]

    // Get all users
    const allUsers = await users.list<UserPrefs>([Query.limit(100)])

    // Sort users by reputation (highest first)
    let sortedUsers = allUsers.users
        .filter((user) => user.prefs?.reputation !== undefined)
        .sort((a, b) => (b.prefs.reputation || 0) - (a.prefs.reputation || 0))

    // Filter by search if provided
    if (search) {
        const searchLower = search.toLowerCase()
        sortedUsers = sortedUsers.filter(user =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        )
    }

    // Paginate
    const totalUsers = sortedUsers.length
    const paginatedUsers = sortedUsers.slice((currentPage - 1) * limit, currentPage * limit)

    const getReputationLevel = (reputation: number) => {
        if (reputation >= 1000) return { label: "Legend", color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10" }
        if (reputation >= 500) return { label: "Expert", color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" }
        if (reputation >= 100) return { label: "Rising Star", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" }
        if (reputation >= 10) return { label: "Contributor", color: "from-green-500 to-emerald-500", bg: "bg-green-500/10" }
        return { label: "Newcomer", color: "from-gray-500 to-gray-400", bg: "bg-gray-500/10" }
    }

    return (
        <>
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={100}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="container relative mx-auto px-4 pb-20 pt-32">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                            <IconUsers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                                Users
                            </h1>
                            <p className="text-gray-400 text-sm">{totalUsers} members in our community</p>
                        </div>
                    </div>

                    {/* Search Form */}
                    <form className="mt-6 max-w-md">
                        <div className="relative">
                            <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search users by name or email..."
                                defaultValue={search || ""}
                                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                    </form>
                </div>

                {/* Users Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedUsers.map((user, index) => {
                        const level = getReputationLevel(user.prefs?.reputation || 0)
                        const rank = (currentPage - 1) * limit + index + 1

                        return (
                            <Link
                                key={user.$id}
                                href={`/users/${user.$id}/${slugify(user.name)}`}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02]"
                            >
                                {/* Rank Badge for Top 3 */}
                                {rank <= 3 && (
                                    <div className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full ${rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"
                                        }`}>
                                        <span className="text-sm font-bold text-white">#{rank}</span>
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center">
                                    {/* Avatar */}
                                    <div className="relative mb-4">
                                        <picture className="block h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/20">
                                            <img
                                                src={avatars.getInitials(user.name, 100, 100).toString()}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </picture>
                                        {/* Level Badge */}
                                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${level.color} px-2 py-0.5 text-[10px] font-bold text-white shadow-lg`}>
                                            {level.label}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                                        {user.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">{user.email}</p>

                                    {/* Reputation */}
                                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                                        <IconTrophy className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-medium text-white">{user.prefs?.reputation || 0}</span>
                                        <span className="text-xs text-gray-400">reputation</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Empty State */}
                {paginatedUsers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <IconUsers className="h-16 w-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                        <p className="text-gray-400">
                            {search ? `No users match "${search}"` : "Be the first to join our community!"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalUsers > limit && (
                    <div className="mt-10">
                        <Pagination total={totalUsers} limit={limit} />
                    </div>
                )}
            </div>
        </>
    )
}

export default UsersPage
