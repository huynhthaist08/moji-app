import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

// signUpSchema: schema mô tả điều kiện của form đăng ký
const signUpSchema = z.object({
    firstname: z.string().min(1, "Tên bắt buộc phải có"),
    lastname: z.string().min(1, "Họ bắt buộc phải có"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Khai báo type cho form
// infer -> tự suy ra kiểu -> từ schema tự suy ra kiểu cho form
type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { signUp } = useAuthStore();
    const navigate = useNavigate();

    // Hook xử lý logic của form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        // truyền generic vào useForm để form nhận được type của input
        resolver: zodResolver(signUpSchema), // để kết nối useForm với zodSchema đã định nghĩa
    });

    const onSubmit = async (data: SignUpFormValues) => {
        // data: SignUpFormValues -> tất cả input mà user nhập vào
        const { firstname, lastname, username, email, password } = data;

        // gọi api backend để signup
        await signUp(username, password, email, firstname, lastname);

        // redirect user qua trang đăng nhập sau khi đăng ký thành công
        navigate("/signin");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-6">
                            {/* Header - Logo */}
                            <div className="flex flex-col items-center text-center gap-2">
                                <a
                                    href="/"
                                    className="mx-auto block w-fit text-center"
                                >
                                    <img src="/logo.svg" alt="Logo" />
                                </a>
                                <h1 className="text-2xl font-bold">
                                    Tạo tài khoản Moji
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Chào mừng bạn! Hãy đăng ký để bắt đầu!
                                </p>
                            </div>

                            {/* Họ và tên */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="lastname"
                                        className="block text-sm"
                                    >
                                        Họ
                                    </Label>
                                    <Input
                                        type="text"
                                        id="lastname"
                                        {...register("lastname")}
                                    />
                                    {/* Todo: error message */}
                                    {errors.lastname && (
                                        <p className="text-destructive text-sm">
                                            {errors.lastname.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="firstname"
                                        className="block text-sm"
                                    >
                                        Tên
                                    </Label>
                                    <Input
                                        type="text"
                                        id="firstname"
                                        {...register("firstname")}
                                    />
                                    {/* Todo: error message */}
                                    {errors.firstname && (
                                        <p className="text-destructive text-sm">
                                            {errors.firstname.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Username */}
                            <div className="flex flex-col gap-3">
                                <Label
                                    htmlFor="username"
                                    className="block text-sm"
                                >
                                    Tên đăng nhập
                                </Label>
                                <Input
                                    type="text"
                                    id="username"
                                    placeholder="moji"
                                    {...register("username")}
                                />
                                {/* Todo: error message */}
                                {errors.username && (
                                    <p className="text-destructive text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-3">
                                <Label
                                    htmlFor="email"
                                    className="block text-sm"
                                >
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="moji@gmail.com"
                                    {...register("email")}
                                />
                                {/* Todo: error message */}
                                {errors.email && (
                                    <p className="text-destructive text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-3">
                                <Label
                                    htmlFor="password"
                                    className="block text-sm"
                                >
                                    Mật khẩu
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                />
                                {/* Todo: error message */}
                                {errors.password && (
                                    <p className="text-destructive text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Button đăng ký */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting} // vô hiệu hoá button khi form đang gửi
                            >
                                Tạo tài khoản
                            </Button>
                            <div className="text-center text-sm">
                                Đã có tài khoản{" "}
                                <a
                                    href="/signin"
                                    className="underline underline-offset-4"
                                >
                                    Đăng nhập
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/placeholderSignUp.png"
                            alt="Image"
                            className="absolute top-1/2 -translate-y-1/2 object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="px-6 text-center text-xs text-balance *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <a href="#">Điều khoản dịch vụ</a> và{" "}
                <a href="#">Chính sách bảo mật</a> của chúng tôi.
            </div>
        </div>
    );
}

// zod -> kiểm tra dữ liệu
// zodResolvers -> kết nối zod với react-hook-form
// react-hook-form -> quản lý trạng thái và sự kiện của form

// useForm
// register -> hàm giúp theo dõi các giá trị trong input (register là 1 function chứa obj)
// handleSubmit -> hàm sẽ chạy khi người dùng nhấn button đăng ký
// formState -> lấy ra trạng thái của form (error: nếu có input ko hợp lệ, isSubmitting: boolean để biết khi nào form đang trong quá trình gửi dữ liệu)

// {...register("lastname")} -> spread operator, kết nối input đó với RHF
